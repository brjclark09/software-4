using AutoMapper;
using WordGame.Server.Dtos;
using WordGame.Server.Models;

namespace WordGame.Server.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Token, opt => opt.Ignore());
    }
}
